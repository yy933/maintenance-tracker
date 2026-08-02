import { test, expect } from "@playwright/test";
import process from "node:process";

// Get environment variables for Supabase API
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const USER_A_EMAIL = process.env.TEST_USER_EMAIL || "user_a@example.com";
const USER_A_PASSWORD = process.env.TEST_USER_PASSWORD || "user123";

const USER_B_EMAIL = process.env.TEST_USER_B_EMAIL || "user_b@example.com";
const USER_B_PASSWORD = process.env.TEST_USER_B_PASSWORD || "user123";

/**
 * Get Access Token from Supabase Auth with email and password
 */
async function getAuthToken(request, email, password) {
  const response = await request.post(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      data: { email, password },
    },
  );

  expect(response.status()).toBe(200);
  const json = await response.json();
  return { token: json.access_token, user: json.user };
}

test.describe("Task 2: Privilege Escalation Resistance & RLS Security API Testing", () => {
  let userAToken, userAInfo;
  let userBToken, userBInfo;

  test.beforeAll(async ({ request }) => {
    // Get User A and User B's Auth Token
    const authA = await getAuthToken(request, USER_A_EMAIL, USER_A_PASSWORD);
    userAToken = authA.token;
    userAInfo = authA.user;

    const authB = await getAuthToken(request, USER_B_EMAIL, USER_B_PASSWORD);
    userBToken = authB.token;
    userBInfo = authB.user;
  });

  // ----------------------------------------------------------------
  // Test 1: Cross-Tenant Mutation
  // ----------------------------------------------------------------
  test("Test 1 (Cross-Tenant Mutation): User A attempts to update User B's ticket via API ➔ Verify 0 affected rows", async ({
    request,
  }) => {
    // 1.  User B creates a ticket
    const createRes = await request.post(
      `${SUPABASE_URL}/rest/v1/repair_tickets`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${userBToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        data: {
          title: `User B Ticket_${Date.now()}`,
          description: "Protected ticket owned by User B",
          user_id: userBInfo.id,
        },
      },
    );
    expect(createRes.status()).toBe(201);
    const [ticketB] = await createRes.json();

    // 2. User A maliciously tries to edit User B's ticket (edit its title)
    const updateRes = await request.patch(
      `${SUPABASE_URL}/rest/v1/repair_tickets?id=eq.${ticketB.id}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${userAToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation", //  REST API return affected rows
        },
        data: {
          title: "Hacked by User A",
        },
      },
    );

    // 3. Verify the result: Due to RLS protection, the request will successfully respond with 200/240, but the length of the affected array must be 0 (no rows updated)
    const updatedRows = await updateRes.json();
    expect(updatedRows).toHaveLength(0);
  });

  // ----------------------------------------------------------------
  // Test 2: Unauthorized Status Change / Non-Pending Mutation
  // ----------------------------------------------------------------
  test("Test 2 (Unauthorized Mutation on Non-Pending Ticket): User attempts to update ticket when status is not pending ➔ Verify request blocked", async ({
    request,
  }) => {
    // 1. User A creates a ticket with status pending
    const createRes = await request.post(
      `${SUPABASE_URL}/rest/v1/repair_tickets`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${userAToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        data: {
          title: `User A Ticket_${Date.now()}`,
          description: "User A normal ticket",
          user_id: userAInfo.id,
          status: "pending",
        },
      },
    );
    expect(createRes.status()).toBe(201);
    const [ticketA] = await createRes.json();

    // 2. Simulate admin edit ticket status to 'completed'
    // (use SERVICE_ROLE_KEY or Admin Token to bypass RLS and update the ticket status)
    const serviceKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
    const advanceStatusRes = await request.patch(
      `${SUPABASE_URL}/rest/v1/repair_tickets?id=eq.${ticketA.id}`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        data: {
          status: "completed",
        },
      },
    );
    expect([200, 204]).toContain(advanceStatusRes.status());

    // 3. User A attempts to modify this ticket that is already in 'completed' status (e.g., modify description)
    const unauthorizedUpdateRes = await request.patch(
      `${SUPABASE_URL}/rest/v1/repair_tickets?id=eq.${ticketA.id}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${userAToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        data: {
          description: "User A trying to modify a completed ticket",
        },
      },
    );

    // 4. Verify the result: Due to RLS protection, the request will fail (Affected row count must be 0 or return 4xx)
    if (unauthorizedUpdateRes.status() === 200) {
      const updatedRows = await unauthorizedUpdateRes.json();
      expect(updatedRows).toHaveLength(0); // affected row array length must be 0
    } else {
      expect([400, 403, 401]).toContain(unauthorizedUpdateRes.status());
    }
  });

  // ----------------------------------------------------------------
  // Test 3: Role Escalation
  // ----------------------------------------------------------------
  test("Test 3 (Role Escalation): User attempts to mutate their own user_profiles.role to admin via API ➔ Verify request blocked", async ({
    request,
  }) => {
    // 1. User A attempts to update their own user_profiles.role to 'admin'
    const updateRoleRes = await request.patch(
      `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userAInfo.id}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${userAToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        data: {
          role: "admin",
        },
      },
    );

    // 2. Verify the result: This operation must be blocked (HTTP Status 403/400) or affected rows must be 0
    if (updateRoleRes.status() === 200) {
      const updatedRows = await updateRoleRes.json();
      expect(updatedRows).toHaveLength(0);
    } else {
      expect([400, 403, 401]).toContain(updateRoleRes.status());
    }

    // 3. Check 'role' in user_profiles again (ensure it is still 'user', not 'admin')
    const fetchProfileRes = await request.get(
      `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userAInfo.id}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${userAToken}`,
        },
      },
    );
    const [profile] = await fetchProfileRes.json();
    expect(profile.role).not.toBe("admin");
  });
});

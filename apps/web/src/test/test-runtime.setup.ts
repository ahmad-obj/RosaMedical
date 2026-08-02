import { vi } from "vitest";

function createQueryBuilder() {
  const result = Promise.resolve({ data: [], error: null, count: 0 });
  const builder = {
    select: () => builder,
    order: () => builder,
    eq: () => builder,
    is: () => builder,
    or: () => builder,
    gt: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: null }),
    then: result.then.bind(result)
  };
  return builder;
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    from: () => createQueryBuilder(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signOut: async () => ({ error: null })
    }
  })
}));

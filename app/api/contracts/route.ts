import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function GET(): Promise<Response> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, message: "Failed to load contracts." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        items: data ?? [],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Failed to load contracts.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = getSupabase();
    const body = (await request.json()) as Record<string, unknown>;

    const { data, error } = await supabase
      .from("contracts")
      .insert(body)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, message: "Failed to save contract." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        item: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Failed to save contract.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const supabase = getSupabase();
    const body = (await request.json()) as {
      id?: string;
      values?: Record<string, unknown>;
    };

    if (!body.id || !body.values) {
      return NextResponse.json(
        { ok: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contracts")
      .update(body.values)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, message: "Contract not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        item: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Failed to update contract.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    const supabase = getSupabase();
    const body = (await request.json()) as { id?: string };

    if (!body.id) {
      return NextResponse.json(
        { ok: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("contracts")
      .delete()
      .eq("id", body.id);

    if (error) {
      return NextResponse.json(
        { ok: false, message: "Failed to delete contract." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Failed to delete contract.",
      },
      { status: 500 }
    );
  }
}
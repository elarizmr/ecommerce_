import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/lib/models/Product";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// "jackets" → "jacket": tək və cəm formada eyni nəticə tapılsın
function singular(term: string) {
  return term.length > 3 && term.endsWith("s") ? term.slice(0, -1) : term;
}

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const subcategory = searchParams.get("subcategory");
  const search = searchParams.get("search")?.trim();

  // ?limit=12 → maksimum 50 məhsul qaytarır. Verilməyibsə, hamısı qayıdır.
  const limitParam = Number(searchParams.get("limit"));
  const limit =
    Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 0;

  const filter: Record<string, any> = {};

  if (section) {
    const s = section.toLowerCase();
    if (s === "last-chance") {
      filter.lastChance = true;
    } else {
      filter.section = s;
    }
  }

  if (subcategory) {
    // "running-gear" → "Running Gear", "running gear", "running-gear"
    const pattern = subcategory.split("-").map(escapeRegex).join("[\\s-]");
    filter.subcategory = { $regex: new RegExp(`^${pattern}$`, "i") };
  }

  // AXTARIŞ: ?search=coach jacket
  // Hər söz ad, kateqoriya, rəng adı və ya bölmədən (men/women/accessories)
  // birinə uyğun gəlməlidir. Bütün sözlər uyğun gəlməlidir (AND).
  if (search) {
    const terms = search.split(/\s+/).filter(Boolean).slice(0, 5);

    filter.$and = terms.map((term) => {
      const lower = term.toLowerCase();
      const rx = new RegExp(escapeRegex(singular(lower)), "i");

      return {
        $or: [
          { name: rx },
          { subcategory: rx },
          { "colors.name": rx },
          // "men" yazanda "women" da çıxmasın deyə dəqiq uyğunluq
          { section: { $in: [lower, lower.replace(/s$/, "")] } },
        ],
      };
    });
  }

  try {
    const query = Product.find(filter).sort({ createdAt: -1 });
    if (limit) query.limit(limit);

    const products = await query;
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Məhsullar yüklənərkən xəta baş verdi" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

// POST: Upload foto do recibo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("foto") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhuma foto enviada" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Arquivo deve ser uma imagem" },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Foto muito grande. Máximo 5MB" },
        { status: 400 }
      );
    }

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), "public", "uploads", "vouchers");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Gerar nome único
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `recibo_${timestamp}_${random}.${extension}`;
    const filepath = join(uploadDir, filename);

    // Converter File para Buffer e salvar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Retornar URL relativa
    const url = `/uploads/vouchers/${filename}`;

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    console.error("[ERRO POST /api/vouchers/upload-foto]:", message);
    return NextResponse.json(
      { error: `Erro ao fazer upload: ${message}` },
      { status: 500 }
    );
  }
}



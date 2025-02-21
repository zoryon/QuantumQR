
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
  
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  
    const qrCode = await prisma.qrCode.findUnique({ where: { id } })
    return NextResponse.json(qrCode)
  }
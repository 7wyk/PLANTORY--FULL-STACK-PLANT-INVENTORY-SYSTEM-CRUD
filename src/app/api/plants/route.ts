import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PlantStatus } from '@/types/plant'

// GET - Fetch all plants for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const plants = await prisma.plant.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(plants)
  } catch (error) {
    console.error('Error fetching plants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new plant
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, species, variety, location, lastWatered, notes, status } = body

    const plant = await prisma.plant.create({
      data: {
        name,
        species,
        variety: variety || null,
        location,
        lastWatered: lastWatered ? new Date(lastWatered) : null,
        notes: notes || null,
        status: status || PlantStatus.HEALTHY,
        userId: user.id,
      },
    })

    return NextResponse.json(plant, { status: 201 })
  } catch (error) {
    console.error('Error creating plant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update an existing plant
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { id, name, species, variety, location, lastWatered, notes, status } = body

    // Verify the plant belongs to the user
    const existingPlant = await prisma.plant.findUnique({
      where: { id },
    })

    if (!existingPlant || existingPlant.userId !== user.id) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
    }

    const plant = await prisma.plant.update({
      where: { id },
      data: {
        name,
        species,
        variety: variety || null,
        location,
        lastWatered: lastWatered ? new Date(lastWatered) : null,
        notes: notes || null,
        status,
      },
    })

    return NextResponse.json(plant)
  } catch (error) {
    console.error('Error updating plant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a plant
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { id } = body

    // Verify the plant belongs to the user
    const existingPlant = await prisma.plant.findUnique({
      where: { id },
    })

    if (!existingPlant || existingPlant.userId !== user.id) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 })
    }

    await prisma.plant.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Plant deleted successfully' })
  } catch (error) {
    console.error('Error deleting plant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
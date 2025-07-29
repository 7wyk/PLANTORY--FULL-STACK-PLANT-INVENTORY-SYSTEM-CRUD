'use client'

import { useSession, signOut } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { PlantCard } from '@/components/plant-card'
import { PlantForm } from '@/components/plant-form'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, Leaf, User, LogOut, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Plant } from '@/types/plant'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchPlants()
    }
  }, [session])

  useEffect(() => {
    const filtered = plants.filter(plant =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPlants(filtered)
  }, [plants, searchTerm])

  const fetchPlants = async () => {
    try {
      const response = await fetch('/api/plants')
      if (response.ok) {
        const data = await response.json()
        setPlants(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch plants",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch plants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePlantCreate = async (plantData: any) => {
    try {
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantData),
      })

      if (response.ok) {
        await fetchPlants()
        setIsDialogOpen(false)
        toast({
          title: "Success",
          description: "Plant added successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add plant",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add plant",
        variant: "destructive",
      })
    }
  }

  const handlePlantUpdate = async (plantData: any) => {
    try {
      const response = await fetch('/api/plants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantData),
      })

      if (response.ok) {
        await fetchPlants()
        setEditingPlant(null)
        toast({
          title: "Success",
          description: "Plant updated successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update plant",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plant",
        variant: "destructive",
      })
    }
  }

  const handlePlantDelete = async (plantId: string) => {
    try {
      const response = await fetch('/api/plants', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: plantId }),
      })

      if (response.ok) {
        await fetchPlants()
        toast({
          title: "Success",
          description: "Plant deleted successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete plant",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plant",
        variant: "destructive",
      })
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const healthyPlants = plants.filter(p => p.status === 'HEALTHY').length
  const plantsNeedingAttention = plants.filter(p => p.status === 'NEEDS_ATTENTION' || p.status === 'SICK').length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Plantory</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem className="flex-col items-start">
                    <div className="font-medium">{session.user?.name}</div>
                    <div className="text-sm text-muted-foreground">{session.user?.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plants.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy Plants</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthyPlants}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
              <div className="h-4 w-4 rounded-full bg-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plantsNeedingAttention}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Plant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <PlantForm
                onSubmit={handlePlantCreate}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Plants Grid */}
        {filteredPlants.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Leaf className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {plants.length === 0 ? 'No plants yet' : 'No plants match your search'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {plants.length === 0 
                  ? 'Start building your plant collection by adding your first plant.'
                  : 'Try adjusting your search terms.'
                }
              </p>
              {plants.length === 0 && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Plant
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onEdit={setEditingPlant}
                onDelete={handlePlantDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPlant} onOpenChange={() => setEditingPlant(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editingPlant && (
            <PlantForm
              plant={editingPlant}
              onSubmit={handlePlantUpdate}
              onCancel={() => setEditingPlant(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Dashboard() {
  return (
    <SessionProvider>
      <DashboardPage />
    </SessionProvider>
  )
}
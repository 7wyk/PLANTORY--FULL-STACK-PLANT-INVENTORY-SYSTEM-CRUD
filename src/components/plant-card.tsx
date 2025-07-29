'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2, MapPin, Calendar, Droplets } from 'lucide-react'
import { Plant, PlantStatus } from '@/types/plant'
import { formatDate, getStatusColor, getStatusIcon } from '@/lib/utils'

interface PlantCardProps {
  plant: Plant
  onEdit: (plant: Plant) => void
  onDelete: (plantId: string) => void
}

export function PlantCard({ plant, onEdit, onDelete }: PlantCardProps) {
  const getStatusBadgeVariant = (status: PlantStatus) => {
    switch (status) {
      case PlantStatus.HEALTHY:
        return 'default'
      case PlantStatus.NEEDS_ATTENTION:
        return 'secondary'
      case PlantStatus.SICK:
        return 'destructive'
      case PlantStatus.DECEASED:
        return 'outline'
      default:
        return 'default'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <Card className="plant-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="text-xl">{getStatusIcon(plant.status)}</span>
              {plant.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground italic">
              {plant.species}
              {plant.variety && ` - ${plant.variety}`}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(plant)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(plant.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={getStatusBadgeVariant(plant.status)}>
            {formatStatus(plant.status)}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{plant.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Added {formatDate(new Date(plant.dateAdded))}</span>
          </div>
          
          {plant.lastWatered && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Droplets className="h-4 w-4" />
              <span>Watered {formatDate(new Date(plant.lastWatered))}</span>
            </div>
          )}
        </div>
        
        {plant.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Notes:</span> {plant.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
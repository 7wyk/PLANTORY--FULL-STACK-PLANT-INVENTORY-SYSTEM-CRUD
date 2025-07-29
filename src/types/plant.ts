export interface Plant {
  id: string
  name: string
  species: string
  variety?: string | null
  location: string
  dateAdded: Date
  lastWatered?: Date | null
  notes?: string | null
  status: PlantStatus
  userId: string
  createdAt: Date
  updatedAt: Date
}

export enum PlantStatus {
  HEALTHY = 'HEALTHY',
  NEEDS_ATTENTION = 'NEEDS_ATTENTION',
  SICK = 'SICK',
  DECEASED = 'DECEASED',
}

export interface CreatePlantData {
  name: string
  species: string
  variety?: string
  location: string
  lastWatered?: Date
  notes?: string
  status?: PlantStatus
}

export interface UpdatePlantData extends Partial<CreatePlantData> {
  id: string
}
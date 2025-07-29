'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Plant, PlantStatus } from '@/types/plant'
import { Leaf } from 'lucide-react'

const plantSchema = z.object({
  name: z.string().min(1, 'Plant name is required'),
  species: z.string().min(1, 'Species is required'),
  variety: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  lastWatered: z.string().optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(PlantStatus),
})

type PlantFormData = z.infer<typeof plantSchema>

interface PlantFormProps {
  plant?: Plant
  onSubmit: (data: PlantFormData & { id?: string }) => void
  onCancel: () => void
}

export function PlantForm({ plant, onSubmit, onCancel }: PlantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PlantFormData>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: plant?.name || '',
      species: plant?.species || '',
      variety: plant?.variety || '',
      location: plant?.location || '',
      lastWatered: plant?.lastWatered 
        ? new Date(plant.lastWatered).toISOString().split('T')[0] 
        : '',
      notes: plant?.notes || '',
      status: plant?.status || PlantStatus.HEALTHY,
    },
  })

  const handleSubmit = async (data: PlantFormData) => {
    setIsSubmitting(true)
    try {
      const submitData = {
        ...data,
        ...(plant && { id: plant.id }),
        lastWatered: data.lastWatered ? new Date(data.lastWatered).toISOString() : undefined,
      }
      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          {plant ? 'Edit Plant' : 'Add New Plant'}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Monstera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="species"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Species *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monstera deliciosa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="variety"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variety</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Thai Constellation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Living room window" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lastWatered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Watered</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PlantStatus.HEALTHY}>
                        <div className="flex items-center gap-2">
                          <span>🌱</span>
                          <span>Healthy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PlantStatus.NEEDS_ATTENTION}>
                        <div className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Needs Attention</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PlantStatus.SICK}>
                        <div className="flex items-center gap-2">
                          <span>🤒</span>
                          <span>Sick</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PlantStatus.DECEASED}>
                        <div className="flex items-center gap-2">
                          <span>💀</span>
                          <span>Deceased</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any care notes, observations, or reminders..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : plant ? 'Update Plant' : 'Add Plant'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
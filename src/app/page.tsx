'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { Leaf, Github, Sprout, TreePine, Flower } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="relative">
                <Leaf className="h-16 w-16 text-green-600 dark:text-green-400" />
                <Sprout className="h-8 w-8 text-green-500 absolute -top-2 -right-2" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Plantory
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Your modern plant inventory management system. Track, monitor, and care for your green friends with ease.
            </p>
            
            <div className="flex justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <TreePine className="h-5 w-5" />
                <span>Track Plants</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Flower className="h-5 w-5" />
                <span>Monitor Health</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Leaf className="h-5 w-5" />
                <span>Care Schedule</span>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="max-w-lg mx-auto backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl border-0">
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to Plantory
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Sign in with GitHub to start managing your plant collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!session ? (
                <Button 
                  onClick={() => signIn('github')}
                  className="w-full h-12 text-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  <Github className="mr-3 h-5 w-5" />
                  Sign in with GitHub
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Welcome back, {session.user?.name}!
                  </p>
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full h-12 text-lg"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border-0">
              <CardContent className="p-6 text-center">
                <TreePine className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Plant Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Keep detailed records of all your plants with species, location, and care notes
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border-0">
              <CardContent className="p-6 text-center">
                <Flower className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Health Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Track plant health status and receive alerts when attention is needed
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border-0">
              <CardContent className="p-6 text-center">
                <Leaf className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Care Schedule</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Never forget watering schedules and maintenance tasks for your plants
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  )
}
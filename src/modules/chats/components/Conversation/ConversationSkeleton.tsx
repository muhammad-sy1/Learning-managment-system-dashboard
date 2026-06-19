import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'

const ConversationSkeleton = () => {
  return (
    <Card className="mt-4">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="h-12 w-12 rounded-full bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/3 bg-slate-200 rounded" />
                <div className="h-3 w-1/2 bg-slate-200 rounded" />
              </div>
            </div>
          </CardHeader>
  
          <CardContent className="h-100 overflow-y-auto px-6 space-y-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                } animate-pulse`}
              >
                <div className="flex items-start gap-3 max-w-[75%]">
                  {index % 2 === 0 && (
                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                  )}
  
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div
                      className={`h-10 rounded-2xl ${
                        index % 2 === 0 ? "bg-slate-200" : "bg-blue-500"
                      }`}
                    />
                  </div>
  
                  {index % 2 !== 0 && (
                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
  )
}

export default ConversationSkeleton
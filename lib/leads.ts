import { prisma } from './db'
import { LeadSource } from '@prisma/client'

export interface CreateLeadData {
  fullName: string
  email?: string
  phone?: string
  source: LeadSource
  message?: string
  meta?: Record<string, any>
}

export async function createLead(data: CreateLeadData) {
  return await prisma.lead.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      source: data.source,
      message: data.message,
      meta: data.meta || {},
    },
  })
}

export async function getLeads(limit?: number) {
  return await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getLeadById(id: string) {
  return await prisma.lead.findUnique({
    where: { id },
  })
}


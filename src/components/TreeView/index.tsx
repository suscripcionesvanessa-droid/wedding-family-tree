'use client'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ReactFlow, Background, Controls,
  type Node, type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { PersonNode } from './PersonNode'
import type { Person, Relationship, RelationshipType } from '@/types'

const nodeTypes = { person: PersonNode }

interface Props {
  people: Person[]
  relationships: Relationship[]
}

function buildLayout(people: Person[], _relationships: Relationship[]): Node[] {
  // Simple grid layout — users can drag nodes to rearrange
  // _relationships reserved for future hierarchy-aware layout
  return people.map((p, i) => ({
    id: p.id,
    type: 'person',
    position: { x: (i % 5) * 140, y: Math.floor(i / 5) * 160 },
    data: p as unknown as Record<string, unknown>,
  }))
}

function buildEdges(relationships: Relationship[]): Edge[] {
  const LABELS: Record<RelationshipType, string> = {
    married_to: 'casado/a con',
    partner_of: 'pareja de',
    parent_of: 'padre/madre de',
    sibling_of: 'hermano/a de',
    uncle_aunt_of: 'tío/a de',
    cousin_of: 'primo/a de',
  }
  const COLORS: Record<RelationshipType, string> = {
    married_to: '#e11d48',
    partner_of: '#f43f5e',
    parent_of: '#6366f1',
    sibling_of: '#9ca3af',
    uncle_aunt_of: '#f59e0b',
    cousin_of: '#10b981',
  }
  return relationships.map(rel => ({
    id: rel.id,
    source: rel.person_a_id,
    target: rel.person_b_id,
    label: LABELS[rel.type],
    labelStyle: { fontSize: 10, fill: COLORS[rel.type], fontWeight: 500 },
    labelBgStyle: { fill: '#ffffff', fillOpacity: 0.85 },
    style: { stroke: COLORS[rel.type], strokeWidth: 2 },
  }))
}

export function TreeView({ people, relationships }: Props) {
  const router = useRouter()
  const baseNodes = useMemo(() => buildLayout(people, relationships), [people, relationships])
  const edges = useMemo(() => buildEdges(relationships), [relationships])

  const nodes = useMemo(
    () => baseNodes.map(n => ({
      ...n,
      data: { ...n.data, onClick: () => router.push(`/person/${n.id}`) },
    })),
    [baseNodes, router]
  )

  return (
    <div className="w-full h-[calc(100vh-8rem)]">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

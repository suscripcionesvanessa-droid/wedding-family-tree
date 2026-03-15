'use client'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ReactFlow, Background, Controls,
  type Node, type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { PersonNode } from './PersonNode'
import type { Person, Relationship } from '@/types'

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
  return relationships.map(rel => ({
    id: rel.id,
    source: rel.person_a_id,
    target: rel.person_b_id,
    label: rel.type === 'married_to' ? '💍' : rel.type === 'parent_of' ? '' : '~',
    style: { stroke: rel.type === 'married_to' ? '#e11d48' : '#9ca3af' },
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

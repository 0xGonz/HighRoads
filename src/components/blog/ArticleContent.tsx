'use client'

interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  const lines = content.trim().split('\n')
  const elements: JSX.Element[] = []
  let currentList: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let key = 0

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      const ListTag = listType
      elements.push(
        <ListTag
          key={key++}
          className={
            listType === 'ul'
              ? 'list-disc pl-5 space-y-2 my-5 text-gray-700'
              : 'list-decimal pl-5 space-y-2 my-5 text-gray-700'
          }
        >
          {currentList.map((item, i) => (
            <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ListTag>
      )
      currentList = []
      listType = null
    }
  }

  const parseInline = (text: string): string => {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    // Links
    text = text.replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-primary-600 hover:text-primary-700 underline underline-offset-2">$1</a>'
    )
    return text
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (!line) {
      flushList()
      continue
    }

    // Headers
    if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-gray-900 mt-12 mb-4">
          {line.slice(3)}
        </h2>
      )
      continue
    }

    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={key++} className="text-xl font-semibold text-gray-900 mt-8 mb-3">
          {line.slice(4)}
        </h3>
      )
      continue
    }

    // Unordered list
    if (line.startsWith('- ')) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      currentList.push(line.slice(2))
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      currentList.push(line.replace(/^\d+\.\s/, ''))
      continue
    }

    // Regular paragraph
    flushList()
    elements.push(
      <p
        key={key++}
        className="text-gray-700 leading-[1.8] my-5 text-[17px]"
        dangerouslySetInnerHTML={{ __html: parseInline(line) }}
      />
    )
  }

  flushList()

  return <article className="max-w-none">{elements}</article>
}

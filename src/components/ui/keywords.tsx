function KeywordsRow({ keywords }: { keywords: string[] | undefined }) {
  if (!keywords) return null

  return (
    <div className="flex items-center justify-between gap-0.5 overflow-hidden min-w-[90px] flex-grow-1 flex-shrink-[2] hover:flex-shrink-1 transition-[flex] duration-200 md:max-[60rem]:hidden max-sm:hidden">
      <span className="flex-grow-1 min-w-0" />
      {keywords.map((keyword) => (
        <div
          key={keyword}
          className="group flex rounded-full min-w-0 last:flex-shrink-[1e-06]"
        >
          <span className=" flex items-center text-xs rounded-full bg-card px-3 border h-7 flex-shrink-0 group-last:max-w-[200px] truncate">
            {keyword}
          </span>
        </div>
      ))}
    </div>
  )
}

export { KeywordsRow }

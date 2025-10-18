import { formatPostDate } from "@/lib/utils"

function DateLines({ postedAt }: { postedAt: string }) {
  const formattedDate = formatPostDate(postedAt)
  const dateLines = formattedDate.split("\n")

  return (
    <div className="flex flex-col items-center justify-center w-10 text-xs text-muted-foreground whitespace-nowrap">
      {dateLines.map((line, index) => (
        <span
          key={index}
          className="nth-2:text-2xs nth-2:italic nth-2:text-muted-foreground/60"
        >
          {line}
        </span>
      ))}
    </div>
  )
}

export { DateLines }

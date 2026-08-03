import { Skeleton, TableCell, TableRow } from '@mui/material'

type TableBodySkeletonProps = {
  rows?: number
  columns: number
}

export function TableBodySkeleton({ rows = 5, columns }: TableBodySkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }, (__, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton
                variant={colIndex === 1 ? 'rounded' : 'text'}
                height={colIndex === 1 ? 36 : 20}
                sx={{ maxWidth: colIndex === 0 ? 28 : colIndex === 1 ? '70%' : '55%' }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

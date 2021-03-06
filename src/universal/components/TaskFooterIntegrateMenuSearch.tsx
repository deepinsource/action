import React, {useCallback, useRef} from 'react'
import styled from 'react-emotion'
import {PALETTE} from 'universal/styles/paletteV2'

interface Props {
  placeholder: string
}

const Input = styled('input')({
  appearance: 'none',
  background: 'inherit',
  border: `1px solid ${PALETTE.BORDER.LIGHT}`,
  borderRadius: 2,
  display: 'block',
  fontSize: 14,
  lineHeight: '24px',
  outline: 'none',
  padding: '3px 0 3px 39px',
  width: '100%',
  '&:focus, &:active': {
    border: `1px solid ${PALETTE.BORDER.BLUE}`,
    boxShadow: `0 0 1px 1px ${PALETTE.BORDER.BLUE_LIGHT}`
  }
})

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TaskFooterIntegrateMenuSearch = (props: Props) => {
  const {onChange, placeholder, value} = props
  const ref = useRef<HTMLInputElement>(null)
  const onBlur = useCallback(() => {
    ref.current && ref.current.focus()
  }, [])
  return (
    <Input
      autoFocus
      innerRef={ref}
      name='search'
      onBlur={onBlur}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  )
}

export default TaskFooterIntegrateMenuSearch

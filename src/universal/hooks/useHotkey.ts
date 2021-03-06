import Mousetrap from 'mousetrap'
import {useEffect, useRef} from 'react'

type Binding = string | string[]
const useHotkey = (
  keys: Binding,
  callback: (e: ExtendedKeyboardEvent, combo: string) => any,
  action?: string
) => {
  const bindingsRef = useRef<Binding[]>([])
  useEffect(() => {
    bindingsRef.current.push(keys)
    Mousetrap.bind(keys, callback, action)
    return () => {
      bindingsRef.current.forEach((key) => {
        Mousetrap.unbind(key)
      })
    }
  }, [])
}

export default useHotkey

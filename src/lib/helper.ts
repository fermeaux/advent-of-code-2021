export function sumOfFirst (number: number): number {
  return number * (number + 1) / 2
}

export function isOneOf (value: any, tests: any[]): boolean {
  return tests.reduce((acc, test) => acc || value === test, false)
}

export function groupBy (objects: any[], key: string): any {
  return objects.reduce((acc, obj) => {
    if (!acc[obj[key]]) {
      acc[obj[key]] = []
    }
    acc[obj[key]].push(obj)
    return acc
  }, {})
}

export function matchAllCharacters (string1: string, string2: string): boolean {
  return string2.split('').every(char2 => string1.includes(char2))
}

export function removeElement (array: any[], element: any): void {
  const i = array.indexOf(element)
  if (i !== -1) {
    array.splice(i, 1)
  }
}

export function reverseMap (map: object): object {
  return Object.entries(map).reduce((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {})
}

export function sortStringKeys (map: object): object {
  return Object.entries(map).reduce((acc, [key, value]) => {
    acc[sortCharacters(key)] = value
    return acc
  }, {})
}

export function sortCharacters (str: string): string {
  return str.split('').sort().join('')
}

export function isValidBoardDirection (board: any[][], point: { x: number, y: number }, dir: {x: number, y: number}): boolean {
  const newX = point.x + dir.x
  const newY = point.y + dir.y
  return (newX >= 0 && newX < board[0].length) && (newY >= 0 && newY < board.length)
}

export function dec2bin (dec) {
  return (dec >>> 0).toString(2)
}

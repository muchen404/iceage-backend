import { parse } from 'yaml'
import { join } from 'path'
import { readFileSync } from 'fs'

export const getEnv = () => {
  return process.env.NODE_ENV
}

// 读取项目配置
export const getConfig = () => {
  const environment = getEnv()
  const yamlPath = join(process.cwd(), `./.config/.${environment}.yaml`)
  const file = readFileSync(yamlPath, 'utf8')
  const config = parse(file)
  return config
}
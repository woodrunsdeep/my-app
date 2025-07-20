import { useDrizzle, tables } from '~/server/utils/useDrizzle'

export default defineEventHandler(async () => {
  try {
    const db = useDrizzle()

    // Get all todos
    const todos = await db.select().from(tables.todos)

    return {
      todos,
      count: todos.length
    }
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
})

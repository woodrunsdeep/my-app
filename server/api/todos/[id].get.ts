import { useDrizzle, tables, eq } from '~/server/utils/useDrizzle'

export default defineEventHandler(async (event) => {
  try {
    const todoId = getRouterParam(event, 'id')

    if (!todoId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Todo ID is required'
      })
    }

    const db = useDrizzle()

    // Get todo by ID
    const [todo] = await db.select().from(tables.todos).where(eq(tables.todos.id, todoId))

    if (!todo) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo not found'
      })
    }

    return todo
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error // Re-throw HTTP errors
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
})

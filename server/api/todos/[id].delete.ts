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

    // Check if todo exists
    const [existingTodo] = await db.select().from(tables.todos).where(eq(tables.todos.id, todoId))

    if (!existingTodo) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo not found'
      })
    }

    // Delete the todo
    await db.delete(tables.todos).where(eq(tables.todos.id, todoId))

    return {
      success: true,
      message: `Todo with ID ${todoId} has been deleted`
    }
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

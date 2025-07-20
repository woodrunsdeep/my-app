import { useDrizzle, tables, eq } from '~/server/utils/useDrizzle'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
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

    // Prepare update data
    const updateData: { title?: string } = {}

    if (body.title && typeof body.title === 'string') {
      updateData.title = body.title.trim()
    }

    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid fields to update'
      })
    }

    // Update the todo
    const [updatedTodo] = await db
      .update(tables.todos)
      .set(updateData)
      .where(eq(tables.todos.id, todoId))
      .returning()

    return {
      success: true,
      todo: updatedTodo
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

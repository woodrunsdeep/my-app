import { useDrizzle, tables } from '~/server/utils/useDrizzle'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const db = useDrizzle()

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required and must be a string'
      })
    }

    // Create new todo
    const [newTodo] = await db.insert(tables.todos).values({
      title: body.title.trim()
      // id and createdAt will be auto-generated
    }).returning()

    return {
      success: true,
      todo: newTodo
    }
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error // Re-throw validation errors
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
})

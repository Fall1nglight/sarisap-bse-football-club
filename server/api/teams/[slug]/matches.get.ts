import { getTeamBySlug } from '~~/shared/teams'
import { getMlszTeamData } from '~~/server/utils/mlsz'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const team = slug ? getTeamBySlug(slug) : undefined

  if (!team) {
    throw createError({ statusCode: 404, statusMessage: 'Ismeretlen csapat.' })
  }

  try {
    return await getMlszTeamData(team.slug)
  }
  catch (error) {
    console.error(`MLSZ meccsadat betöltési hiba (${team.slug}):`, error)
    throw createError({ statusCode: 502, statusMessage: 'Az MLSZ meccsadatai átmenetileg nem érhetők el.' })
  }
})

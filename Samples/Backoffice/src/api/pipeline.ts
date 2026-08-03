import { createPipelineClient } from '@raccoonland/pipeline-client'
import { httpClient } from './httpClient'

/** Default Pipeline client for this sample's primary API. */
export const pipelineClient = createPipelineClient(httpClient)

export const fetchPipeline = pipelineClient.fetchPipeline.bind(pipelineClient)

import { Types, PipelineStage } from 'mongoose';
import { UsageEvent } from '../models/UsageEvent.js';

export async function getTenantUsageSummary(tenantId: string, days = 7) {
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const pipeline: PipelineStage[] = [
    { $match: { tenantId: new Types.ObjectId(tenantId), createdAt: { $gte: from } } },
    {
      $group: {
        _id: {
          day: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d' } },
          endpoint: '$endpoint',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        day: '$_id.day',
        endpoint: '$_id.endpoint',
        status: '$_id.status',
        count: 1
      }
    },
    { $sort: { day: 1, endpoint: 1, status: 1 } }
  ];
  const rows = await UsageEvent.aggregate(pipeline);
  return rows as Array<{ day: string; endpoint: string; status: number; count: number }>;
}

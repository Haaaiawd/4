<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">个人成长</h1>
        <p class="text-muted-foreground text-lg">追踪你的成长历程和进步</p>
      </div>

      <!-- 成长进度卡片 -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="group p-6 bg-background rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <i class="ri-target-line mr-2 text-primary"></i>
            本周目标
          </h3>
          <div class="space-y-6">
            <div class="transform transition-all duration-300 hover:scale-[1.02]">
              <div class="flex justify-between text-sm mb-2">
                <span class="font-medium">冥想练习</span>
                <span class="text-primary">{{ weeklyGoals.meditation.current }}/{{ weeklyGoals.meditation.target }} 天</span>
              </div>
              <div class="h-2.5 bg-muted rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${(weeklyGoals.meditation.current / weeklyGoals.meditation.target) * 100}%` }"
                ></div>
              </div>
            </div>
            <div class="transform transition-all duration-300 hover:scale-[1.02]">
              <div class="flex justify-between text-sm mb-2">
                <span class="font-medium">阅读时间</span>
                <span class="text-primary">{{ weeklyGoals.reading.current }}/{{ weeklyGoals.reading.target }} 小时</span>
              </div>
              <div class="h-2.5 bg-muted rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${(weeklyGoals.reading.current / weeklyGoals.reading.target) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="group p-6 bg-background rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <i class="ri-bar-chart-line mr-2 text-primary"></i>
            成长统计
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span class="text-sm font-medium">对话次数</span>
              <span class="text-2xl font-bold text-primary">{{ stats.conversations }}</span>
            </div>
            <div class="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span class="text-sm font-medium">获得洞察</span>
              <span class="text-2xl font-bold text-primary">{{ stats.insights }}</span>
            </div>
            <div class="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span class="text-sm font-medium">连续打卡</span>
              <span class="text-2xl font-bold text-primary">{{ stats.streak }} 天</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 成长轨迹 -->
      <div class="mt-8 p-6 bg-background rounded-xl border shadow-sm">
        <h3 class="text-xl font-semibold mb-6 flex items-center">
          <i class="ri-road-map-line mr-2 text-primary"></i>
          成长轨迹
        </h3>
        <div class="space-y-6">
          <div 
            v-for="milestone in milestones" 
            :key="milestone.date" 
            class="flex gap-4 group"
          >
            <div class="flex-shrink-0 w-20 text-sm text-muted-foreground pt-1">
              {{ milestone.date }}
            </div>
            <div class="flex-1 pb-6 border-l-2 border-muted pl-6 relative">
              <!-- 时间线圆点 -->
              <div class="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:scale-125 transition-transform duration-300"></div>
              <div class="bg-muted/30 p-4 rounded-lg group-hover:bg-muted/50 transition-colors">
                <div class="font-medium mb-1">{{ milestone.title }}</div>
                <p class="text-sm text-muted-foreground">
                  {{ milestone.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能提示 -->
      <div class="mt-8 p-6 bg-muted/30 rounded-xl border">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <i class="ri-lightbulb-line mr-2 text-primary"></i>
          小贴士
        </h3>
        <ul class="text-sm text-muted-foreground space-y-2">
          <li 
            v-for="(tip, index) in tips" 
            :key="index"
            class="flex items-start hover:text-foreground transition-colors"
          >
            <span class="mr-2 text-primary">•</span>
            {{ tip }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 周目标数据
const weeklyGoals = ref({
  meditation: {
    current: 3,
    target: 7
  },
  reading: {
    current: 2,
    target: 4
  }
})

// 统计数据
const stats = ref({
  conversations: 12,
  insights: 8,
  streak: 5
})

// 成长轨迹
const milestones = ref([
  {
    date: '3月20日',
    title: '完成了第一次深度对话',
    description: '探讨了工作与生活的平衡问题，获得了新的视角和启发。通过AI教练的引导，明确了下一步的行动计划。'
  },
  {
    date: '3月18日',
    title: '设定了第一个目标',
    description: '开始培养每日冥想的习惯，设定了循序渐进的计划。从每天5分钟开始，逐步增加到15分钟。'
  },
  {
    date: '3月15日',
    title: '加入成长计划',
    description: '开始使用 Life Coach，制定了个人成长目标，期待在AI教练的帮助下实现突破。'
  }
])

// 小贴士
const tips = ref([
  '定期回顾你的成长轨迹，反思和调整目标',
  '完成每日目标可以获得额外的洞察点数',
  '持续的进步比完美的开始更重要',
  '尝试设定具体、可衡量、可实现的小目标',
  '与AI教练深度对话可以帮助你发现盲点'
])
</script>

<style scoped>
.container {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 
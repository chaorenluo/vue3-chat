declare global {
  const message: typeof import('../../node_modules/ant-design-vue/lib')['message'];
  const nextTick: typeof import('vue')['nextTick'];
  const toRaw: typeof import('vue')['toRaw'];
  const toRef: typeof import('vue')['toRef'];
  const toRefs: typeof import('vue')['toRefs'];
  const ref: typeof import('vue')['ref'];
  const reactive: typeof import('vue')['reactive'];
  const onMounted: typeof import('vue')['onMounted'];
}
export {};

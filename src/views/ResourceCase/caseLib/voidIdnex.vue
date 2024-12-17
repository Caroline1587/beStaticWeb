<template>
	<el-container class="common-table-layout">
	</el-container>
</template>
<script
  setup
  lang="ts"
>
	const globalpropsstore = getGlobalPropsStore()
	onMounted(() => {
		globalpropsstore.commonRouter({ path: '/libraryCase', view: 'testCase' })
	})
</script>
<style
  lang='scss'
  scoped
>
</style>

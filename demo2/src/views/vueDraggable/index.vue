<template>
	<div class="container">
    <div class="left">
      <vuedraggable
        v-model="arr1"
        :move="onMove"
        :options="{ group: { name: 'site', pull: 'clone' }, sort: true }"
        animation="300"
        drag-class="dragClass"
        ghost-class="ghostClass"
        chosen-class="chosenClass"
      >
        <transition-group>
          <div v-for="item in arr1" :key="item.id" class="item">
            {{ item.name }}
          </div>
        </transition-group>
      </vuedraggable>      
    </div>

    <div class="right">
      <vuedraggable
        v-model="arr2"
        group="site"
        animation="300"
      >
        <transition-group>
          <div v-for="item in arr2" :key="item.id" class="item">
            {{ item.name }}
          </div>
        </transition-group>
      </vuedraggable>  
    </div>
	</div>
</template>

<script>
import vuedraggable from "vuedraggable";

export default {
	name: "",
	components: {
		vuedraggable,
	},
	data() {
		return {
			arr1: [
				{ id: 1, isConfig: true, name: "www.itxst.com" },
				{ id: 2, isConfig: true, name: "www.jd.com" },
				{ id: 3, isConfig: true, name: "www.baidu.com" },
				{ id: 4, isConfig: true, name: "www.taobao.com" },
			],
			arr2: [
				{ id: 5, name: "www.google.com" },
				{ id: 6, name: "www.msn.com" },
				{ id: 7, name: "www.ebay.com" },
				{ id: 8, name: "www.yahoo.com" },
			],
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		onMove(e, originalEvent) {
			console.log(e, originalEvent, "onMove");
			// 停靠对象 如果停靠对象是A区，就拒绝掉
			if (e.relatedContext.element.isConfig) return false;

			// 拖拽对象
			// if (e.draggedContext.element.isConfig) return false
			return true;
		},
	},
};
</script>

<style scoped lang="scss"></style>

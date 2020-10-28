<template>
<div>
    <div>
        <div style="display:inline-block; margin-right:16px;">
            <Input v-model.trim="label" :placeholder="'添加' + desc" @on-enter="handleAddLabel" style="width:300px;"><Button slot="append" icon="md-add" @click="handleAddLabel">添加</Button></Input>
        </div>
        <Tag v-for="label in value" type="dot" color="primary" :key="label.labelName" :name="label.labelName" closable @on-close="handleRemoveLabel" style="vertical-align: top; margin-right:8px;">{{ label.labelName }}</Tag>
    </div>
    <div class="label_select_area">
        <span v-if="data.length==0">暂无数据</span>
        <Tag v-for="label in data" :key="label" :name="label" @click.native="handleSelectLabel(label)" style="margin-left:6px; margin-right:6px;">{{label}}</Tag>
    </div>
    <span class="field-tip">可选常用{{desc}}</span>
</div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: [],
            required: true
        },
        data: {
            type: Array,
            default: [],
            required: true
        },
        desc: {
            type: String,
            default: '特点',
            required: true
        }
    },
    data() {
        return {
            label: ''
        };
    },
    methods: {
        handleAddLabel() {
            if (!this.label) {
                this.$Message.warning("请输入" + this.desc);
                return false;
            }
            if (this.value.length >= 5) {
                this.$Message.warning("最多只能录入5个" + this.desc);
                return false;
            }
            for (let i = 0; i < this.value.length; i++) {
                if (this.label == this.value[i].labelName) {
                    this.$Message.warning("已存在该" + this.desc);
                    return false;
                }
            }
            this.value.push({
                labelName: this.label
            });
            this.label = "";
        },
        handleSelectLabel(name) {
            if (this.value.length >= 5) {
                this.$Message.warning("最多只能录入5个" + this.desc);
                return false;
            }
            for (let i = 0; i < this.value.length; i++) {
                if (name == this.value[i].labelName) {
                    this.$Message.warning("已存在该" + this.desc);
                    return false;
                }
            }
            this.value.push({
                labelName: name
            });
        },
        handleRemoveLabel(event, name) {
            for (let i = 0; i < this.value.length; i++) {
                if (name == this.value[i].labelName) {
                    this.value.splice(i, 1);
                    return;
                }
            }
        }
    }
};
</script>

<style scoped>
.label_select_area {
    padding: 2px 8px;
    border: 1px solid transparent;
    border-color: #e8eaec;
    border-radius: 4px;
    display: inline-block;
    min-width: 300px;
}
</style>

<template>
<Tree :data="treeData" :render="renderTree"></Tree>
</template>

<script>
export default {
    data() {
        return {
            treeData: [],
            buttonProps: {
                type: 'default',
                size: 'small'
            }
        }
    },
    methods: {
        getTreeData() {
            let data = [];
            this.treeData.forEach(item => {
                data.push(this.copyNode(item));
            });
            return data;
        },
        setTreeData(data) {
            this.treeData = [];
            data.forEach(item => {
                this.treeData.push(this.copyNode(item));
            });
        },
        getLeafNodeIds() {
            let nodeIds = [];
            this.doFindLeafNodes(nodeIds, this.treeData);
            return nodeIds;
        },
        doFindLeafNodes(nodeIds, nodeList) {
            nodeList.forEach(item => {
                if (item.children.length == 0) {
                    nodeIds.push(item.id);
                } else {
                    this.doFindLeafNodes(nodeIds, item.children);
                }
            });
        },
        clear() {
            this.treeData = [];
        },
        addNodes(nodeArray) {
            let nodeList = this.treeData;
            for (let i = 0; i < nodeArray.length; i++) {
                let node = this.copyNode(nodeArray[i]);
                nodeList = this.handleAddNode(node, nodeList, i == nodeArray.length - 1);
            }
        },
        handleAddNode(node, nodeList, isLeaf) {
            for (let i = 0; i < nodeList.length; i++) {
                if (nodeList[i].id == node.id) {
                    if (isLeaf) {
                        nodeList[i].children = [];
                    }
                    return nodeList[i].children;
                }
            }
            node.children = [];
            nodeList.push(node);
            nodeList.sort(function (a, b) {
                return a.sort - b.sort;
            });
            return node.children;
        },
        renderTree(h, {
            root,
            node,
            data
        }) {
            let style = {};
            if (data.isDisabled) {
                style.color = '#999';
            }
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('span', {
                        style: style
                    }, data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '16px'
                    }
                }, [
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-remove'
                        }),
                        on: {
                            click: () => {
                                this.removeTreeNode(node, this.treeData);
                            }
                        }
                    })
                ])
            ]);
        },
        removeTreeNode(node, nodeList) {
            for (let i = 0; i < nodeList.length; i++) {
                if (nodeList[i].nodeKey == node.nodeKey) {
                    nodeList.splice(i, 1);
                    break;
                } else {
                    this.removeTreeNode(node, nodeList[i].children);
                }
            }
        },
        copyNode(node) { // 拷贝树节点
            let obj = {};
            obj.id = node.id;
            obj.longId = node.longId;
            obj.isDisabled = (typeof node.disabled != 'undefined' && node.disabled != null) ? node.disabled : node.isDisabled;
            obj.title = (obj.isDisabled ? '【已禁用】' : '') + node.orgName;
            obj.orgName = node.orgName;
            obj.comId = node.comId;
            obj.sort = (node.nodeKey) ? node.nodeKey : node.id;
            obj.expand = true;
            obj.children = [];
            for (let i = 0; i < node.children.length; i++) {
                obj.children.push(this.copyNode(node.children[i]));
            }
            return obj;
        }
    }
}
</script>

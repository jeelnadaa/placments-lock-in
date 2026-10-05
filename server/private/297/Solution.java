import java.util.*;

class Solution {
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("null,");
        } else {
            sb.append(node.val).append(",");
            buildString(node.left, sb);
            buildString(node.right, sb);
        }
    }

    public TreeNode deserialize(String data) {
        String[] tokens = data.split(",");
        java.util.Queue<String> nodes = new java.util.LinkedList<>(Arrays.asList(tokens));
        return buildTree(nodes);
    }

    private TreeNode buildTree(java.util.Queue<String> nodes) {
        String val = nodes.poll();
        if (val == null || val.equals("null") || val.isEmpty()) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }

    public TreeNode serializeDeserialize(TreeNode root) {
        return deserialize(serialize(root));
    }
}

import java.util.*;
import java.io.*;
import java.lang.*;


/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     public int val;
 *     public TreeNode left;
 *     public TreeNode right;
 *     public TreeNode() {}
 *     public TreeNode(int val) { this.val = val; }
 *     public TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        
    }

    public TreeNode serializeDeserialize(TreeNode root) {
        return deserialize(serialize(root));
    }
}

import java.util.*;

class WordDictionary {
    private static class Node {
        Node[] children = new Node[26];
        boolean isEnd = false;
    }

    private Node root;

    public WordDictionary() {
        root = new Node();
    }

    public void addWord(String word) {
        Node curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) {
                curr.children[idx] = new Node();
            }
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        return searchInNode(word, 0, root);
    }

    private boolean searchInNode(String word, int idx, Node curr) {
        if (curr == null) return false;
        if (idx == word.length()) return curr.isEnd;
        char c = word.charAt(idx);
        if (c == '.') {
            for (Node child : curr.children) {
                if (child != null && searchInNode(word, idx + 1, child)) return true;
            }
            return false;
        } else {
            return searchInNode(word, idx + 1, curr.children[c - 'a']);
        }
    }
}

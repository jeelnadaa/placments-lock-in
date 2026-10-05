import java.lang.reflect.*;
import java.util.*;

public class Reflector {

    private static final String[] COMMON_PACKAGES = {
        "java.lang",
        "java.util",
        "java.util.concurrent",
        "java.util.concurrent.atomic",
        "java.util.regex",
        "java.io",
        "java.math",
        "java.util.stream",
        "java.text"
    };

    private static Class<?> findClass(String name) {
        String query = name.replace('.', '$');
        try {
            return Class.forName(name);
        } catch (ClassNotFoundException ignored) {}

        try {
            return Class.forName(query);
        } catch (ClassNotFoundException ignored) {}

        for (String pkg : COMMON_PACKAGES) {
            try {
                return Class.forName(pkg + "." + name);
            } catch (ClassNotFoundException ignored) {}
            try {
                return Class.forName(pkg + "." + query);
            } catch (ClassNotFoundException ignored) {}
        }

        if (name.equalsIgnoreCase("Entry") || name.equalsIgnoreCase("MapEntry")) {
            try {
                return Class.forName("java.util.Map$Entry");
            } catch (ClassNotFoundException ignored) {}
        }

        return null;
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    public static void main(String[] args) {
        String query = args.length > 0 ? args[0].trim() : "Map";
        Class<?> clazz = findClass(query);

        if (clazz == null) {
            System.out.println("[]");
            return;
        }

        Map<String, String> uniqueMethods = new TreeMap<>();

        // Public methods
        for (Method m : clazz.getMethods()) {
            if (!Modifier.isPublic(m.getModifiers())) continue;

            String name = m.getName();
            String retType = m.getReturnType().getSimpleName();
            Parameter[] params = m.getParameters();

            StringBuilder sig = new StringBuilder();
            sig.append(retType).append(" ").append(name).append("(");

            StringBuilder snippet = new StringBuilder();
            snippet.append(name).append("(");

            StringBuilder paramTypes = new StringBuilder();
            for (int i = 0; i < params.length; i++) {
                if (i > 0) {
                    sig.append(", ");
                    snippet.append(", ");
                    paramTypes.append(",");
                }
                String pType = params[i].getType().getSimpleName();
                String pName = params[i].getName();
                sig.append(pType).append(" ").append(pName);
                snippet.append("${").append(i + 1).append(":").append(pName).append("}");
                paramTypes.append(pType);
            }
            sig.append(")");
            snippet.append(")");

            String key = name + "(" + paramTypes + ")";
            if (!uniqueMethods.containsKey(key)) {
                StringBuilder item = new StringBuilder("{");
                item.append("\"label\":\"").append(escapeJson(name)).append("\",");
                item.append("\"type\":\"method\",");
                item.append("\"detail\":\"").append(escapeJson(sig.toString())).append("\",");
                item.append("\"apply\":\"").append(escapeJson(snippet.toString())).append("\"");
                item.append("}");
                uniqueMethods.put(key, item.toString());
            }
        }

        // Public static fields / constants
        for (Field f : clazz.getFields()) {
            if (!Modifier.isPublic(f.getModifiers())) continue;
            String name = f.getName();
            String fType = f.getType().getSimpleName();

            StringBuilder item = new StringBuilder("{");
            item.append("\"label\":\"").append(escapeJson(name)).append("\",");
            item.append("\"type\":\"").append(Modifier.isFinal(f.getModifiers()) ? "constant" : "property").append("\",");
            item.append("\"detail\":\"").append(escapeJson(fType + " " + name)).append("\",");
            item.append("\"apply\":\"").append(escapeJson(name)).append("\"");
            item.append("}");
            uniqueMethods.put("field_" + name, item.toString());
        }

        System.out.println("[" + String.join(",", uniqueMethods.values()) + "]");
    }
}

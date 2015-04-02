package com.google.appinventor.server.project.youngandroid;

import java.util.Map;
import com.google.appinventor.shared.properties.json.*;

public abstract class Component {
  public abstract String[] getComponentString(Map<String,JSONValue> componentsMap);
}


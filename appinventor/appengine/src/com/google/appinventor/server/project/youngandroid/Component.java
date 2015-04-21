package com.google.appinventor.server.project.youngandroid;

import java.util.ArrayList;
import java.util.Map;

import javax.annotation.Nullable;

import com.google.appinventor.shared.properties.json.*;

public abstract class Component {
  
  public Component()
  {
  }
  
  public abstract ParseResult getComponentString(Map<String,JSONValue> componentsMap, Boolean hasParent);

}


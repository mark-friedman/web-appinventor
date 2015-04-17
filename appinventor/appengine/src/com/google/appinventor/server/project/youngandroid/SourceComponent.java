package com.google.appinventor.server.project.youngandroid;


public abstract class SourceComponent extends Component {

  String srcPrefix;
  
  // Force use of the other constructor - assetPrefix required
  private SourceComponent()
  {
    super();
  }
  
  public SourceComponent(String assetPrefix)
  {
    this.srcPrefix = assetPrefix;
  }    

  public String getSrcPrefix() {
    return srcPrefix;
  }

  public void setSrcPrefix(String srcPrefix) {
    this.srcPrefix = srcPrefix;
  }
  
  /* This property helps build the file name for the asset file 
   * Do not make the return value css or html specific, or you 
   * will break the retrieval of the asset from storage.
   */
  public String getPrefixedSrc(String src) {

    if ((srcPrefix == null) || (srcPrefix == "")) 
    {
      // return whatever the input string is 
      return src;
    }
    else if ((src == null) || (src == ""))
    {
      // If no source value, then just return empty string
      // Nothing to prefix in this case
      return "";
    }
    else {
      return srcPrefix + src;
    }
  }
  
  
}

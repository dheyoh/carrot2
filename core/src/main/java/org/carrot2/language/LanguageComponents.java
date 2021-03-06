/*
 * Carrot2 project.
 *
 * Copyright (C) 2002-2020, Dawid Weiss, Stanisław Osiński.
 * All rights reserved.
 *
 * Refer to the full license file "carrot2.LICENSE"
 * in the root folder of the repository checkout or at:
 * https://www.carrot2.org/carrot2.LICENSE
 */
package org.carrot2.language;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

/** A set of language-specific components. */
public final class LanguageComponents {
  private final String language;
  private final Map<Class<?>, Supplier<?>> components;

  public LanguageComponents(String language, Map<Class<?>, Supplier<?>> suppliers) {
    this.language = language;
    this.components = suppliers;
  }

  public String language() {
    return language;
  }

  public <T> T get(Class<T> componentClass) {
    Supplier<?> supplier = components.get(componentClass);
    if (supplier == null) {
      throw new RuntimeException(
          String.format(
              Locale.ROOT,
              "This instance of LanguageComponents for language '%s' does not come with a supplier of component class '%s'.",
              language,
              componentClass.getName()));
    }
    return componentClass.cast(supplier.get());
  }

  public <T> LanguageComponents override(Class<T> clazz, Supplier<? extends T> supplier) {
    Map<Class<?>, Supplier<?>> clonedSuppliers = new LinkedHashMap<>(components);
    clonedSuppliers.put(clazz, supplier);
    return new LanguageComponents(language, clonedSuppliers);
  }

  public Set<Class<?>> components() {
    return components.keySet();
  }

  public static LanguageComponentsLoader loader() {
    return new LanguageComponentsLoader();
  }
}

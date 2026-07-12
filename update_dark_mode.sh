#!/bin/bash
find transitops/frontend/src/views transitops/frontend/src/components -type f -name "*.tsx" | while read -r file; do
  # Avoid modifying Navbar again
  if [[ "$file" == *"Navbar.tsx"* ]]; then
    continue
  fi
  sed -i 's/bg-white\([^A-Za-z0-9_-]\)/bg-white dark:bg-gray-900\1/g' "$file"
  sed -i 's/text-gray-900/text-gray-900 dark:text-gray-100/g' "$file"
  sed -i 's/text-gray-800/text-gray-800 dark:text-gray-200/g' "$file"
  sed -i 's/text-gray-700/text-gray-700 dark:text-gray-300/g' "$file"
  sed -i 's/text-gray-600/text-gray-600 dark:text-gray-400/g' "$file"
  sed -i 's/text-gray-500/text-gray-500 dark:text-gray-400/g' "$file"
  sed -i 's/bg-gray-50\([^A-Za-z0-9_-]\)/bg-gray-50 dark:bg-gray-800\1/g' "$file"
  sed -i 's/border-gray-100/border-gray-100 dark:border-gray-800/g' "$file"
  sed -i 's/border-gray-200/border-gray-200 dark:border-gray-700/g' "$file"
  sed -i 's/hover:bg-gray-50\([^A-Za-z0-9_-]\)/hover:bg-gray-50 dark:hover:bg-gray-800\1/g' "$file"
  sed -i 's/bg-white"/bg-white dark:bg-gray-900"/g' "$file"
  sed -i 's/bg-gray-50"/bg-gray-50 dark:bg-gray-800"/g' "$file"
  sed -i 's/hover:bg-gray-50"/hover:bg-gray-50 dark:hover:bg-gray-800"/g' "$file"
done

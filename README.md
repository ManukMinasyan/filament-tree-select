# Filament Select Tree

A tree select component for Filament PHP.

## Features

- Hierarchical dropdown selection for Filament forms
- Single and multiple selection modes
- Searchable options
- Customizable display
- **Smart path expansion to selected items** - Automatically expands only the paths needed to reveal selected items

## Installation

You can install the package via composer:

```bash
composer require manukminasyan/filament-select-tree
```

## Usage

```php
use ManukMinasyan\FilamentSelectTree\SelectTree;

SelectTree::make('category')
    ->label('Category')
    ->placeholder('Select a category')
    ->searchable()
    ->expandSelected() // Automatically expands paths to selected items
    ->options([
        [
            'name' => 'Electronics',
            'value' => 'electronics',
            'children' => [
                [
                    'name' => 'Phones',
                    'value' => 'electronics.phones',
                    'children' => [
                        [
                            'name' => 'iPhone',
                            'value' => 'electronics.phones.iphone',
                        ],
                        [
                            'name' => 'Android',
                            'value' => 'electronics.phones.android',
                        ],
                    ],
                ],
                [
                    'name' => 'Laptops',
                    'value' => 'electronics.laptops',
                ],
            ],
        ],
        [
            'name' => 'Books',
            'value' => 'books',
        ],
    ])
```

## Smart Path Expansion

The `expandSelected()` feature automatically expands only the specific paths needed to reveal selected items in the tree, keeping other branches collapsed for a cleaner UI.

When a user selects a deeply nested option (e.g., "electronics.phones.iphone"), the component will:

1. Only expand the nodes along the path to the selected item (e.g., "electronics" and "electronics.phones")
2. Keep other branches collapsed for a cleaner UI
3. Preserve this behavior across form submissions and page reloads
4. Work with both dot-notation paths and custom hierarchical data structures

This is particularly useful for deeply nested data where expanding all nodes to a fixed level would create a cluttered interface.


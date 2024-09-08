from collections import deque, defaultdict

# u1, u2, r1, r2, d1, d2, l1, l2


# The solved state of the 3x3 sliding puzzle
solved_state = (1, 2, 3, 4, 5, 6, 7, 8, 0)
visited = set()
visited_nodes = list()
# Possible moves (up, down, left, right) in terms of index changes
moves = {
    'up': -3,
    'up-twice': -6,
    'down': 3,
    'down-twice': 6,
    'left': -1,
    'left-twice': -2,
    'right': 1,
    'right-twice': 2
}

def get_move(previous_state, new_state):
    previous_index = previous_state.index(0)
    new_index = new_state.index(0)

    if previous_index % 3 == new_index % 3:
        _previous_index = previous_index // 3
        _new_index = new_index // 3
        if _previous_index - _new_index == 1:
            return "u1"
        elif _previous_index - _new_index == 2:
            return "u2"
        elif _previous_index - _new_index == -1:
            return "d1"
        elif _previous_index - _new_index == -2:
            return "d2"
        
    diff = previous_index - new_index
    if diff == 1:
        return "l1"
    elif diff == 2:
        return "l2"
    elif diff == -1:
        return "r1"
    elif diff == -2:
        return "r2"
    



# Check if a move is valid given the current position of the blank (0)
def is_valid_move(index, move):
    if move == 'left' and index % 3 == 0:
        return False
    if move == 'left-twice' and index % 3 <= 1:
        return False
    if move == 'right' and index % 3 == 2:
        return False
    if move == 'right-twice' and index % 3 >= 1:
        return False
    if move == 'up' and index < 3:
        return False
    if move == 'up-twice' and index < 6:
        return False
    if move == 'down' and index > 5:
        return False
    if move == 'down-twice' and index > 2:
        return False
    return True


# Apply a move to the puzzle state
def apply_move(state, index, move):
    new_state = list(state)

    if move == 'left-twice':
        new_index = index - 1
        new_index_2 = index - 2
        new_state[index], new_state[new_index], new_state[new_index_2] = new_state[new_index], new_state[new_index_2], new_state[index]
    elif move == 'right-twice':
        new_index = index + 1
        new_index_2 = index + 2
        new_state[index], new_state[new_index], new_state[new_index_2] = new_state[new_index], new_state[new_index_2], new_state[index]
    elif move == 'up-twice':
        new_index = index - 3
        new_index_2 = index - 6
        new_state[index], new_state[new_index], new_state[new_index_2] = new_state[new_index], new_state[new_index_2], new_state[index]
    elif move == 'down-twice':
        new_index = index + 3
        new_index_2 = index + 6
        new_state[index], new_state[new_index], new_state[new_index_2] = new_state[new_index], new_state[new_index_2], new_state[index]
    else:
        new_index = index + moves[move]
        new_state[index], new_state[new_index] = new_state[new_index], new_state[index]
    
    return tuple(new_state)


class PuzzleNode:
    def __init__(self, state, level):
        self.state = state
        self.children = []
        self.parents = []
        self.level = level


# Build the tree from the solved state
def build_tree():
    root = PuzzleNode(solved_state, 0)
    visited_nodes.append(root)
    queue = deque([root])
    global visited
    visited.add(solved_state)
    
    while queue:
        current_node = queue.popleft()
        blank_index = current_node.state.index(0)
        
        for move in moves:
            if is_valid_move(blank_index, move):
                new_state = apply_move(current_node.state, blank_index, move)
                # check if the new node pointing to a parent has the same level as other children
                if new_state not in visited:    
                    visited.add(new_state)
                    child_node = PuzzleNode(new_state, current_node.level + 1)
                    current_node.children.append(child_node)
                    child_node.parents.append(current_node)
                    queue.append(child_node)
                    visited_nodes.append(child_node)

    
    return root



# Build the tree and store the root
puzzle_tree_root = build_tree()



def getnode(state) -> PuzzleNode|None:
    for node in visited_nodes:
        if node.state == state:
            return node
    return None


# use this tree to find the shortest path between any 2 arbitrary nodes in the tree
def find_path(state = (1, 2, 3, 4, 5, 6, 7, 8, 0)):
    if state == solved_state:
        return 0
    node = getnode(state)
    # print(node.state, [x.state for x in node.children], [x.state for x in node.parents], node.level)
    # print([x.state for x in visited_nodes])
    k = True
    print(node.state)
    moves = 0
    str_moves = []
    while k:
        least_level_parent = min(node.parents, key=lambda x: x.level)
        # print(least_level_parent == node)
        # get the moves here.
        str_moves.append(get_move(node.state, least_level_parent.state))

        node = least_level_parent
        print(node.state)
        moves += 1
        if node.state == solved_state:
            k = False

    print(moves)
    print(str_moves)
    return str_moves


# find_path((0,2,3,7,5,4,6,1,8))

import sys
import math
import random
import time
import copy

INFINITY = 9999999

class Game:
    def __init__(self, big_board, small_board, last_move, turn=-1):
        self.big_board = big_board
        self.small_board = small_board
        self.last_move = last_move
        self.turn = turn

    def legal(self):
        last_move = self.last_move
        small_board = self.small_board
        big_board = self.big_board
        if last_move[0] == -1 and last_move[1] == -1:
            return [[i, j] for i in range(0, 9) for j in range(0, 9)]
        else:
            if big_board[last_move[0]%3][last_move[1]%3] == 0:
                return [[i+3*(last_move[0]%3), j+3*(last_move[1]%3)] for i in range(0, 3) for j in range(0, 3) if small_board[i+3*(last_move[0]%3)][j+3*(last_move[1]%3)] == 0]
            else:
                return [[i, j] for i in range(0, 9) for j in range(0, 9) if small_board[i][j] == 0]

    def apply(self, move, player):
        if move[0] != -1 and move[1] != -1:
            if player != self.turn:
                raise RuntimeError(f"Turn not valid {self.turn}")
            sb = self.small_board
            bb = self.big_board
            lm = self.last_move
            winning_positions = [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
                                 [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
                                 [[0, 0], [1, 1], [2, 2]], [[2, 0], [1, 1], [0, 2]]]

            if move in self.legal():
                sb[move[0]][move[1]] = player
                self.last_move = move
                for winning_position in winning_positions:
                    bb_i_x = move[0]//3
                    bb_i_y = move[1]//3

                    x0 = winning_position[0][0] + bb_i_x * 3
                    y0 = winning_position[0][1] + bb_i_y * 3
                    x1 = winning_position[1][0] + bb_i_x * 3
                    y1 = winning_position[1][1] + bb_i_y * 3
                    x2 = winning_position[2][0] + bb_i_x * 3
                    y2 = winning_position[2][1] + bb_i_y * 3

                    if (sb[x0][y0] == player and
                        sb[x0][y0] == sb[x1][y1] and
                        sb[x0][y0] == sb[x2][y2]):
                        for i in range(0, 3):
                            for j in range(0, 3):
                                sb[i+bb_i_x*3][j+bb_i_y*3] = player
                        bb[bb_i_x][bb_i_y] = player
                        break
            self.turn *= -1

        else:
            self.turn *= -1

    def is_terminal(self):
        bb = self.big_board
        winning_positions = [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
                             [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
                             [[0, 0], [1, 1], [2, 2]], [[2, 0], [1, 1], [0, 2]]]
        for winning_position in winning_positions:
            x0 = winning_position[0][0]
            y0 = winning_position[0][1]
            x1 = winning_position[1][0]
            y1 = winning_position[1][1]
            x2 = winning_position[2][0]
            y2 = winning_position[2][1]
            if (bb[x0][y0] != 0 and
                bb[x0][y0] == bb[x1][y1] and
                bb[x0][y0] == bb[x2][y2]):
                return bb[x0][y0]
        if len(self.legal()) == 0:
            return 2
        else:
            return 0

    def view_board(self):
        board = self.small_board
        for i in range(0, 9):
            if i % 3 == 0:
                print('\n')
            for j in range(0, 9):
                color = ''
                if i == self.last_move[0] and j == self.last_move[1]:
                    #color = '\033[1;32;40m'
                    color = ''
                else:
                    color = ''
                if j % 3 == 0:
                    print(' ', end=' ')
                player = board[i][j]
                if player == 1:
                    print(color + 'X', end=' ')
                if player == -1:
                    print(color + 'O', end=' ')
                if player == 0:
                    print('_', end=' ')
            print('\n')

    def reward(self, player_turn):
        result = self.is_terminal()
        if result == player_turn:
            return 1.0
        elif result == 2:
            return .5
        else:
            return .0

class Player:
    def __init__(self, player_type, player_turn, epsylon=1.0, K=0, mast_enabled=False, rave_enabled=False):
        self.player_type = player_type
        self.player_turn = player_turn
        self.root = None
        self.epsylon = epsylon
        self.K = K
        self.mast_enabled = mast_enabled
        self.rave_enabled = rave_enabled
        self.w_mast = {}
        self.n_mast = {}

    def duel(self, game, first_move):
        new_game = copy.deepcopy(game)
        player_turn = self.player_turn

        moves_history = []

        if new_game.last_move[0] != -1 and new_game.last_move[1] != -1:
            if new_game.turn != player_turn:
                moves_history.append(new_game.last_move)

        if first_move[0] != -1 and first_move[1] != -1:
            if new_game.turn != player_turn:
                moves_history.append(first_move)
            new_game.apply(first_move, new_game.turn)

        while new_game.is_terminal() == 0:
            self.make_playout_move(new_game)
            if new_game.turn != player_turn:
                moves_history.append(new_game.last_move)

        reward = new_game.reward(player_turn)

        if self.mast_enabled:
            for move in moves_history:
                move_key = str(move[0]) + str(move[1])
                if move_key in self.w_mast:
                    self.n_mast[move_key] += 1.0
                    self.w_mast[move_key] += reward
                else:
                    self.n_mast[move_key] = 1.0
                    self.w_mast[move_key] = reward
        return {'reward': reward, 'moves_history': moves_history}

    def make_playout_move(self, game):
        legal_moves = game.legal()
        if not self.mast_enabled or random.random() < self.epsylon:
            best_move = legal_moves[math.floor(random.random()*len(legal_moves))]
        else:
            n_mast = self.n_mast
            w_mast = self.w_mast
            random.shuffle(legal_moves)
            best_move = legal_moves[0]
            best_value = 0.0
            best_move_key = str(best_move[0]) + str(best_move[1])
            for move in legal_moves:
                move_key = str(move[0]) + str(move[1])
                if move_key in w_mast:
                    if w_mast[move_key]/n_mast[move_key] > best_value:
                        best_move = move
                        best_value = w_mast[move_key]/n_mast[move_key]
                        best_move_key = move_key
        game.apply(best_move, game.turn)
        return best_move

    def make_move(self, game, time_for_move=0):
        if game.is_terminal() == 0:
            player_type = self.player_type
            player_turn = self.player_turn
            if player_type == 'random':
                legal_moves = game.legal()
                random_move = legal_moves[math.floor(random.random()*len(legal_moves))]
                game.apply(random_move, player_turn)
                return random_move
            if player_type == 'flat_mc':
                start_time = time.time()
                w = {}
                n = {}
                q = {}
                n_sum = 0
                legal_moves = game.legal()
                while time.time() < start_time + time_for_move:
                    move = legal_moves[math.floor(random.random()*len(legal_moves))]
                    key = str(move[0])+str(move[1])
                    if str(move[0])+str(move[1]) in w:
                        w[key] += self.duel(game, move)['reward']
                        n[key] += 1.0
                        q[key] = w[key]/n[key]
                    else:
                        w[key] = self.duel(game, move)['reward']
                        n[key] = 1.0
                        q[key] = w[key]/n[key]
                    n_sum += 1
                max_key = max(q, key=q.get)
                max_move = [int(max_key[0]), int(max_key[1])]
                #print(n_sum, file=sys.stderr, flush=True)
                game.apply(max_move, self.player_turn)
                return max_move
            if player_type == 'mcts':
                start_time = time.time()

                if self.root is None:
                    node = Node(game, self.player_turn, None, 1.41, self.K, self.mast_enabled, self.rave_enabled)
                else:
                    node = self.root
                    if game.last_move != [-1, -1]:
                        if len(node.children) == 0:
                            node.create_children()
                        children = node.children
                        for child_key in children:
                            if game.last_move == children[child_key].state.last_move:
                                node = children[child_key]
                                node.delete_parent()
                                break

                iterations = 0
                while time.time() < start_time + time_for_move:
                    iterations += 1
                    current_node = node.best_child()
                    while current_node.N != 0 and current_node.state.is_terminal() == 0:
                        current_node = current_node.best_child()
                    duel_result = self.duel(current_node.state, [-1, -1])
                    current_node.backpropagate(duel_result['reward'], duel_result['moves_history'], self.n_mast, self.w_mast)

                children = node.children

                max_child = children[max(children, key=children.get)]
                max_move = max_child.state.last_move
                game.apply(max_move, self.player_turn)

                node = max_child
                node.delete_parent()
                self.root = node
                #print(str(max_child.W_rave) + ' ' + str(max_child.N_rave), file=sys.stderr, flush=True)
                #print(str(max_child.W) + ' ' + str(max_child.N), file=sys.stderr, flush=True)
                #print(iterations, file=sys.stderr, flush=True)
                return max_move

class Node:
    def __init__(self, state, player_turn, parent=None, exploration_weight=1.41, K=0, mast_enabled=False, rave_enabled=False):
        self.children = {}
        self.exploration_weight = exploration_weight
        self.W = 0.0
        self.N = 0.0
        self.W_rave = 0.0
        self.N_rave = 0.0
        self.parent = parent
        self.state = state
        self.mast_enabled = mast_enabled
        self.rave_enabled = rave_enabled
        self.K = K
        self.player_turn = player_turn

    def __lt__(self, other):
        return (self.N < other.N) or (self.N == other.N and self.state.turn * self.W < self.state.turn * other.W)

    def create_children(self):
        children = self.children
        state = self.state
        if state.is_terminal() == 0:
            legal_moves = state.legal()
            random.shuffle(legal_moves)
            for move in legal_moves:
                new_state = copy.deepcopy(state)
                new_state.apply(move, state.turn)
                children[str(move[0]) + str(move[1])] = Node(new_state, self.player_turn, self, self.exploration_weight, self.K, self.mast_enabled, self.rave_enabled)

    def beta(self, N):
        K = self.K
        return math.sqrt(K/(3 * N + K))

    def UCB(self, child):
        if child.N == 0.0:
            return INFINITY
        else:
            if self.rave_enabled:
                if self.state.turn == self.player_turn:
                    return (1-self.beta(child.N)) * (child.W / child.N) + self.beta(child.N) * child.W_rave/(child.N_rave+1) + child.exploration_weight * math.sqrt(math.log(self.N)/child.N)
                else:
                    return 1 - (1-self.beta(child.N)) * (child.W / child.N) + self.beta(child.N) * child.W_rave/(child.N_rave+1) + child.exploration_weight * math.sqrt(math.log(self.N)/child.N)
            else:
                if self.state.turn == self.player_turn:
                    return (child.W / child.N) + child.exploration_weight * math.sqrt(math.log(self.N)/child.N)
                else:
                    return 1 - (child.W / child.N) + child.exploration_weight * math.sqrt(math.log(self.N)/child.N)

    def best_child(self):
        children = self.children
        if len(children) == 0 and self.state.is_terminal() == 0:
            self.create_children()

        best_value = 0.0
        best_child = children[next(iter(children))]
        for child_key in children:
            value = self.UCB(children[child_key])
            if value > best_value:
                best_value = value
                best_child = children[child_key]
        return best_child

    def backpropagate(self, reward, moves_history, n_mast, w_mast):

        self.N += 1.0
        self.W += reward

        if self.mast_enabled:
            last_move = self.state.last_move
            if self.state.turn != self.player_turn:
                move_key = str(last_move[0]) + str(last_move[1])
                if move_key in w_mast:
                    n_mast[move_key] += 1.0
                    w_mast[move_key] += reward
                else:
                    n_mast[move_key] = 1.0
                    w_mast[move_key] = reward

        if self.parent != None:
            if self.rave_enabled:
                for child_key in self.parent.children:
                    child = self.parent.children[child_key]
                    if child.state.last_move in moves_history:
                        child.W_rave += reward
                        child.N_rave += 1.0
            self.parent.backpropagate(reward, moves_history, n_mast, w_mast)

    def delete_parent(self):
        self.parent = None

game = Game([[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]], [-1, -1])

#player_type, player_turn, root=None, epsylon=1.0, K=0, mast_enabled=False, rave_enabled=False
#player = Player('mcts', 1, 0.4, 5, True, True)
player = Player('mcts', 1, 0.4, 21, True, True)

while True:
    opponent_row, opponent_col = [int(i) for i in input().split()]
    valid_action_count = int(input())
    for i in range(valid_action_count):
        row, col = [int(j) for j in input().split()]

    game.apply([opponent_row, opponent_col], -1)

    if game.last_move[0] == -1 and game.last_move[1] == -1:
        move = player.make_move(game, 1.0)
    else:
        move = player.make_move(game, .095)

    # Write an action using print
    # To debug: print("Debug messages...", file=sys.stderr, flush=True)

    print(str(move[0]) + " " + str(move[1]))

#include <iostream>
#include <string>
using namespace std;

void print_t_matrix(int32_t **graph, int32_t m){
  for (int32_t i = 0; i < m; i++)
  {
    for (int32_t j = 0; j < m; j++)
    {
      cout << graph[i][j] << " ";
    }
    cout << endl;
  }
}

extern "C" {
  void assign_cell(int32_t **graph, int32_t row, int32_t col, int32_t value){
    graph[row][col] = value;
    graph[col][row] = value;
  }

  void new_graph(int32_t n, int32_t **graph) {
    for (int32_t i = 0; i < n; i++)
    {
      for (int32_t j = i; j < n; j++)
      {
        if(i == j){
          graph[i][j] = 0;continue;
        }
        graph[i][j] = -1;
        graph[j][i] = -1;
      }
    }
    return;
  }

  int32_t tsp(int32_t **graph, int32_t node, int32_t *nodes_path, int32_t cost, int32_t n, int32_t m, int32_t *min_cost, int32_t *min_path) {
    if (min_cost[0] > 0 && cost > min_cost[0]){
      return -1;
    }
    if(n==0){
      return cost;
    }
    int32_t copy_nodes[m] = { }; //= (int32_t *) calloc(m, sizeof(int32_t));
    if (node >= 0)
    {
      for (int32_t i = 0; i < m ; i++)
      {
        copy_nodes[i] = nodes_path[i];
      }
      copy_nodes[node] = m - n;
    }
    int32_t curr = -1;
    for (int32_t i = 0; i < m; i++)
    {
      if (node < 0)
      { 
        curr = tsp(graph, i, copy_nodes, cost, n-1, m, min_cost, min_path);
      } 
      else if (graph[node][i] > 0 && copy_nodes[i] == 0) 
      {
        int32_t new_cost = cost + graph[node][i];
        curr = tsp(graph, i, copy_nodes, new_cost, n-1, m, min_cost, min_path); 
      } 
      if (curr > 0 && (curr < min_cost[0] || min_cost[0] < 0))
      {
        min_cost[0] = curr;
        for (int32_t j = 0; j < m; j++)
        {
          min_path[j] = copy_nodes[j]; 
        }
      }
    }
    //free(copy_nodes);
    return -1;
  }
}

int main() {
  uint32_t n = 7;
  int32_t **graph = (int32_t **)malloc(n * sizeof(int32_t *));
  for (int32_t i = 0; i < n; i++)
  {
    graph[i] = (int32_t*) malloc(n * sizeof(int32_t));
  }

  new_graph(n, graph);

  assign_cell(graph, 0, 1, 10);
  assign_cell(graph, 0, 3, 8);
  assign_cell(graph, 0, 4, 7);
  assign_cell(graph, 1, 2, 12);
  assign_cell(graph, 1, 3, 7);
  assign_cell(graph, 2, 3, 6);
  assign_cell(graph, 2, 5, 7);
  assign_cell(graph, 2, 6, 5);
  assign_cell(graph, 3, 4, 9);
  assign_cell(graph, 3, 5, 4);
  assign_cell(graph, 4, 6, 11);
  assign_cell(graph, 5, 6, 3);

  int32_t *min_cost = (int32_t *)malloc(sizeof(int32_t));
  int32_t *min_path = (int32_t *)malloc(n * sizeof(int32_t));
  int32_t *nodes = (int32_t *)calloc(n, sizeof(int32_t));

  min_cost[0] = -1;
  tsp(graph, -1, nodes, 0, n, n, min_cost, min_path);
  

  for (int32_t i = 0; i < n; i++)
  {
    free(graph[i]);
  }
  free(min_path);
  free(min_cost);
  free(nodes);
  free(graph);
  return 0;
}

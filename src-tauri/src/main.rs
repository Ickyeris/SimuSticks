// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rdev::{listen, Event, EventType};
use tauri::Manager;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
struct NodeData {
    id: String,
    #[serde(rename = "type")]
    node_type: String,
    data: serde_json::Value
}

#[derive(Debug, Clone, Deserialize, Serialize)]
struct EdgeData {
    source: String,
    target: String
}

#[derive(Debug, Clone, Deserialize, Serialize)]
struct Graph {
    nodes: Vec<NodeData>,
    edges: Vec<EdgeData>
}


#[tauri::command]
fn update_graph(graph: Graph) {
    println!("Recieved graph: {:?}", graph);

}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![update_graph])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
